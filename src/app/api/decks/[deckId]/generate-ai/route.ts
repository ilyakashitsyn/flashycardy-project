import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { cardsTable } from "@/db/schema";

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const { has } = await auth();

    // Проверяем доступ к функции ИИ генерации
    if (!has({ feature: "ai_flashcard_generation" })) {
      return NextResponse.json(
        { error: "AI generation is not available in your plan" },
        { status: 403 }
      );
    }

    const { title, description } = await request.json();
    const { deckId: deckIdParam } = await params;
    const deckId = parseInt(deckIdParam);

    if (!title) {
      return NextResponse.json(
        { error: "Deck title is required" },
        { status: 400 }
      );
    }

    // Генерируем 20 карточек с помощью OpenAI API
    const generatedCards = await generateAICardsWithOpenAI(title, description);

    // Сохраняем карточки в базу данных
    const savedCards = await Promise.all(
      generatedCards.map(async (card: { front: string; back: string }) => {
        const [savedCard] = await db
          .insert(cardsTable)
          .values({
            deckId,
            front: card.front,
            back: card.back,
          })
          .returning();

        return {
          id: savedCard.id,
          front: savedCard.front,
          back: savedCard.back,
          progress: null,
        };
      })
    );

    return NextResponse.json({
      cards: savedCards,
      message: "AI cards generated successfully",
    });
  } catch (error) {
    console.error("Error generating AI cards:", error);
    return NextResponse.json(
      { error: "Failed to generate AI cards" },
      { status: 500 }
    );
  }
}

async function generateAICardsWithOpenAI(title: string, description: string) {
  if (!OPENAI_API_KEY) {
    // Fallback to basic cards if OpenAI API key is not configured
    return generateBasicFallbackCards(title, description);
  }

  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const prompt = createPromptForDeck(title, description);

      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that creates educational flashcards. Always respond with valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        let errorMessage = `OpenAI API error: ${response.status}`;

        // Handle specific error codes
        switch (response.status) {
          case 429:
            errorMessage =
              "OpenAI API rate limit exceeded. Please try again in a few minutes.";
            break;
          case 401:
            errorMessage = "OpenAI API key is invalid or expired.";
            break;
          case 403:
            errorMessage =
              "OpenAI API access denied. Please check your API key permissions.";
            break;
          case 500:
            errorMessage = "OpenAI API server error. Please try again later.";
            break;
          default:
            errorMessage = `OpenAI API error (${response.status}). Please try again.`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      // Parse the JSON response
      const parsedCards = JSON.parse(content);

      // Validate and ensure we have exactly 20 cards
      if (Array.isArray(parsedCards.cards) && parsedCards.cards.length === 20) {
        return parsedCards.cards;
      } else {
        throw new Error("Invalid card format received from OpenAI");
      }
    } catch (error) {
      lastError = error as Error;
      console.error(`OpenAI API attempt ${attempt + 1} failed:`, error);

      // If this is the last attempt or it's a non-retryable error, break
      if (
        attempt === maxRetries ||
        (error instanceof Error && error.message.includes("rate limit"))
      ) {
        break;
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  // If we get here, all attempts failed
  console.error("All OpenAI API attempts failed. Using fallback cards.");
  console.error("Last error:", lastError);

  const fallbackCards = generateBasicFallbackCards(title, description);

  // Add metadata about fallback usage
  (fallbackCards as any).__fallback = true;
  (fallbackCards as any).__error = lastError?.message || "Unknown error";

  return fallbackCards;
}

function createPromptForDeck(title: string, description: string) {
  const isLanguage =
    /language|portuguese|spanish|french|german|italian|english|vocabulary|grammar|verbs|nouns|pronunciation/i.test(
      title + " " + description
    );

  if (isLanguage) {
    return `Create exactly 20 unique flashcards for learning ${title}. Each card should have a different word or phrase in the target language on the front and its English translation on the back.

Requirements:
- Generate 20 DIFFERENT words/phrases (no duplicates)
- Front: word/phrase in the target language
- Back: English translation
- Focus on basic, essential vocabulary for beginners
- Include greetings, common phrases, numbers, colors, family members, basic verbs, etc.
- Make sure each card is unique and useful for learning

Respond with JSON only in this exact format:
{
  "cards": [
    {"front": "word1", "back": "translation1"},
    {"front": "word2", "back": "translation2"},
    ...
  ]
}`;
  } else {
    return `Create exactly 20 unique flashcards for learning about ${title}. Each card should have a question on the front and a clear, concise answer on the back.

Requirements:
- Generate 20 DIFFERENT questions (no duplicates)
- Front: specific question about the topic
- Back: clear, educational answer
- Questions should cover different aspects of the subject
- Answers should be informative but concise
- Make sure each card is unique and valuable for learning

Respond with JSON only in this exact format:
{
  "cards": [
    {"front": "question1", "back": "answer1"},
    {"front": "question2", "back": "answer2"},
    ...
  ]
}`;
  }
}

function generateLanguageCards(title: string, description: string) {
  // Определяем конкретный язык для более точных карточек
  const isPortuguese = /portuguese|português|brazil|brasil/i.test(
    title + " " + description
  );
  const isSpanish = /spanish|español|espanol|mexico|argentina/i.test(
    title + " " + description
  );
  const isFrench = /french|français|francais|france/i.test(
    title + " " + description
  );
  const isGerman = /german|deutsch|deutschland|germany/i.test(
    title + " " + description
  );
  const isItalian = /italian|italiano|italia|italy/i.test(
    title + " " + description
  );

  if (isPortuguese) {
    return generatePortugueseCards();
  } else if (isSpanish) {
    return generateSpanishCards();
  } else if (isFrench) {
    return generateFrenchCards();
  } else if (isGerman) {
    return generateGermanCards();
  } else if (isItalian) {
    return generateItalianCards();
  } else {
    return generateGenericLanguageCards();
  }
}

function generatePortugueseCards() {
  const portugueseCards = [
    {
      front: "Olá",
      back: "Hello / Hi",
    },
    {
      front: "Bom dia",
      back: "Good morning",
    },
    {
      front: "Boa tarde",
      back: "Good afternoon",
    },
    {
      front: "Boa noite",
      back: "Good evening / Good night",
    },
    {
      front: "Como você está?",
      back: "How are you?",
    },
    {
      front: "Estou bem, obrigado",
      back: "I'm fine, thank you",
    },
    {
      front: "Por favor",
      back: "Please",
    },
    {
      front: "Obrigado / Obrigada",
      back: "Thank you (male/female)",
    },
    {
      front: "De nada",
      back: "You're welcome",
    },
    {
      front: "Desculpe",
      back: "Sorry / Excuse me",
    },
    {
      front: "Sim",
      back: "Yes",
    },
    {
      front: "Não",
      back: "No",
    },
    {
      front: "Eu não entendo",
      back: "I don't understand",
    },
    {
      front: "Fale mais devagar",
      back: "Speak more slowly",
    },
    {
      front: "Como se diz... em português?",
      back: "How do you say... in Portuguese?",
    },
    {
      front: "Onde fica...?",
      back: "Where is...?",
    },
    {
      front: "Que horas são?",
      back: "What time is it?",
    },
    {
      front: "Quanto custa?",
      back: "How much does it cost?",
    },
    {
      front: "Eu gosto de...",
      back: "I like...",
    },
    {
      front: "Eu não gosto de...",
      back: "I don't like...",
    },
  ];

  return portugueseCards;
}

function generateSpanishCards() {
  const spanishCards = [
    {
      front: "Hola",
      back: "Hello / Hi",
    },
    {
      front: "Buenos días",
      back: "Good morning",
    },
    {
      front: "Buenas tardes",
      back: "Good afternoon",
    },
    {
      front: "Buenas noches",
      back: "Good evening / Good night",
    },
    {
      front: "¿Cómo estás?",
      back: "How are you?",
    },
    {
      front: "Estoy bien, gracias",
      back: "I'm fine, thank you",
    },
    {
      front: "Por favor",
      back: "Please",
    },
    {
      front: "Gracias",
      back: "Thank you",
    },
    {
      front: "De nada",
      back: "You're welcome",
    },
    {
      front: "Lo siento",
      back: "Sorry / I'm sorry",
    },
    {
      front: "Sí",
      back: "Yes",
    },
    {
      front: "No",
      back: "No",
    },
    {
      front: "No entiendo",
      back: "I don't understand",
    },
    {
      front: "Habla más despacio",
      back: "Speak more slowly",
    },
    {
      front: "¿Cómo se dice... en español?",
      back: "How do you say... in Spanish?",
    },
    {
      front: "¿Dónde está...?",
      back: "Where is...?",
    },
    {
      front: "¿Qué hora es?",
      back: "What time is it?",
    },
    {
      front: "¿Cuánto cuesta?",
      back: "How much does it cost?",
    },
    {
      front: "Me gusta...",
      back: "I like...",
    },
    {
      front: "No me gusta...",
      back: "I don't like...",
    },
  ];

  return spanishCards;
}

function generateFrenchCards() {
  const frenchCards = [
    {
      front: "Bonjour",
      back: "Hello / Good morning",
    },
    {
      front: "Bonsoir",
      back: "Good evening",
    },
    {
      front: "Au revoir",
      back: "Goodbye",
    },
    {
      front: "Comment allez-vous?",
      back: "How are you? (formal)",
    },
    {
      front: "Je vais bien, merci",
      back: "I'm fine, thank you",
    },
    {
      front: "S'il vous plaît",
      back: "Please (formal)",
    },
    {
      front: "Merci",
      back: "Thank you",
    },
    {
      front: "De rien",
      back: "You're welcome",
    },
    {
      front: "Pardon",
      back: "Sorry / Excuse me",
    },
    {
      front: "Oui",
      back: "Yes",
    },
    {
      front: "Non",
      back: "No",
    },
    {
      front: "Je ne comprends pas",
      back: "I don't understand",
    },
    {
      front: "Parlez plus lentement",
      back: "Speak more slowly",
    },
    {
      front: "Comment dit-on... en français?",
      back: "How do you say... in French?",
    },
    {
      front: "Où est...?",
      back: "Where is...?",
    },
    {
      front: "Quelle heure est-il?",
      back: "What time is it?",
    },
    {
      front: "Combien ça coûte?",
      back: "How much does it cost?",
    },
    {
      front: "J'aime...",
      back: "I like...",
    },
    {
      front: "Je n'aime pas...",
      back: "I don't like...",
    },
    {
      front: "Enchanté",
      back: "Nice to meet you",
    },
  ];

  return frenchCards;
}

function generateGermanCards() {
  const germanCards = [
    {
      front: "Hallo",
      back: "Hello / Hi",
    },
    {
      front: "Guten Morgen",
      back: "Good morning",
    },
    {
      front: "Guten Tag",
      back: "Good day",
    },
    {
      front: "Guten Abend",
      back: "Good evening",
    },
    {
      front: "Wie geht es Ihnen?",
      back: "How are you? (formal)",
    },
    {
      front: "Es geht mir gut, danke",
      back: "I'm fine, thank you",
    },
    {
      front: "Bitte",
      back: "Please",
    },
    {
      front: "Danke",
      back: "Thank you",
    },
    {
      front: "Bitte schön",
      back: "You're welcome",
    },
    {
      front: "Entschuldigung",
      back: "Sorry / Excuse me",
    },
    {
      front: "Ja",
      back: "Yes",
    },
    {
      front: "Nein",
      back: "No",
    },
    {
      front: "Ich verstehe nicht",
      back: "I don't understand",
    },
    {
      front: "Sprechen Sie langsamer",
      back: "Speak more slowly",
    },
    {
      front: "Wie sagt man... auf Deutsch?",
      back: "How do you say... in German?",
    },
    {
      front: "Wo ist...?",
      back: "Where is...?",
    },
    {
      front: "Wie spät ist es?",
      back: "What time is it?",
    },
    {
      front: "Wie viel kostet das?",
      back: "How much does it cost?",
    },
    {
      front: "Ich mag...",
      back: "I like...",
    },
    {
      front: "Ich mag... nicht",
      back: "I don't like...",
    },
  ];

  return germanCards;
}

function generateItalianCards() {
  const italianCards = [
    {
      front: "Ciao",
      back: "Hello / Hi / Goodbye",
    },
    {
      front: "Buongiorno",
      back: "Good morning",
    },
    {
      front: "Buonasera",
      back: "Good evening",
    },
    {
      front: "Come stai?",
      back: "How are you?",
    },
    {
      front: "Sto bene, grazie",
      back: "I'm fine, thank you",
    },
    {
      front: "Per favore",
      back: "Please",
    },
    {
      front: "Grazie",
      back: "Thank you",
    },
    {
      front: "Prego",
      back: "You're welcome",
    },
    {
      front: "Mi dispiace",
      back: "Sorry / I'm sorry",
    },
    {
      front: "Sì",
      back: "Yes",
    },
    {
      front: "No",
      back: "No",
    },
    {
      front: "Non capisco",
      back: "I don't understand",
    },
    {
      front: "Parla più lentamente",
      back: "Speak more slowly",
    },
    {
      front: "Come si dice... in italiano?",
      back: "How do you say... in Italian?",
    },
    {
      front: "Dove è...?",
      back: "Where is...?",
    },
    {
      front: "Che ora è?",
      back: "What time is it?",
    },
    {
      front: "Quanto costa?",
      back: "How much does it cost?",
    },
    {
      front: "Mi piace...",
      back: "I like...",
    },
    {
      front: "Non mi piace...",
      back: "I don't like...",
    },
    {
      front: "Piacere",
      back: "Nice to meet you",
    },
  ];

  return italianCards;
}

function generateGenericLanguageCards() {
  const genericCards = [
    {
      front: "Hello",
      back: "A greeting used when meeting someone",
    },
    {
      front: "Goodbye",
      back: "A farewell when leaving someone",
    },
    {
      front: "Please",
      back: "A polite word used when making a request",
    },
    {
      front: "Thank you",
      back: "An expression of gratitude",
    },
    {
      front: "You're welcome",
      back: "A polite response to 'thank you'",
    },
    {
      front: "Sorry",
      back: "An expression of apology or regret",
    },
    {
      front: "Yes",
      back: "An affirmative response",
    },
    {
      front: "No",
      back: "A negative response",
    },
    {
      front: "I don't understand",
      back: "A phrase used when you don't comprehend something",
    },
    {
      front: "Speak more slowly",
      back: "A request for someone to talk at a slower pace",
    },
    {
      front: "How do you say...?",
      back: "A question asking for the translation of a word or phrase",
    },
    {
      front: "Where is...?",
      back: "A question asking for the location of something",
    },
    {
      front: "What time is it?",
      back: "A question asking for the current time",
    },
    {
      front: "How much does it cost?",
      back: "A question asking for the price of something",
    },
    {
      front: "I like...",
      back: "A phrase expressing positive feelings about something",
    },
    {
      front: "I don't like...",
      back: "A phrase expressing negative feelings about something",
    },
    {
      front: "Nice to meet you",
      back: "A phrase used when meeting someone for the first time",
    },
    {
      front: "Excuse me",
      back: "A phrase used to get someone's attention or apologize",
    },
    {
      front: "Good morning",
      back: "A greeting used in the morning",
    },
    {
      front: "Good evening",
      back: "A greeting used in the evening",
    },
  ];

  return genericCards;
}

function generateScienceCards(title: string, description: string) {
  const scienceCards = [
    {
      front: "What are the fundamental principles of this scientific field?",
      back: "Fundamental principles include basic laws, theories, and concepts that form the foundation of understanding in this scientific discipline.",
    },
    {
      front: "How do scientists conduct experiments in this field?",
      back: "Scientific experiments follow the scientific method: observation, hypothesis, experimentation, data collection, analysis, and conclusion.",
    },
    {
      front: "What are the key formulas and equations used?",
      back: "Key formulas represent mathematical relationships between variables and are essential for solving problems and making calculations in this field.",
    },
    {
      front: "How does this science apply to real-world problems?",
      back: "This science applies to solving practical problems, developing technologies, improving processes, and advancing human knowledge and capabilities.",
    },
    {
      front: "What are the main branches or subfields?",
      back: "Main branches include specialized areas of study that focus on specific aspects, theories, or applications within the broader scientific discipline.",
    },
    {
      front: "What are common misconceptions about this topic?",
      back: "Common misconceptions often arise from oversimplification, outdated information, or misunderstanding of complex scientific concepts and principles.",
    },
    {
      front: "How has this field evolved over time?",
      back: "This field has evolved through scientific discoveries, technological advances, new theories, and improved understanding of fundamental principles.",
    },
    {
      front: "What are the current research areas and trends?",
      back: "Current research focuses on emerging technologies, new discoveries, solving complex problems, and advancing the boundaries of current knowledge.",
    },
    {
      front: "How do scientists measure and quantify phenomena?",
      back: "Scientists use standardized units, instruments, and methods to measure, observe, and quantify natural phenomena accurately and consistently.",
    },
    {
      front: "What are the ethical considerations in this field?",
      back: "Ethical considerations include responsible research practices, safety concerns, environmental impact, and consideration of potential consequences.",
    },
    {
      front: "How does this science connect to other disciplines?",
      back: "This science connects to other fields through interdisciplinary research, shared principles, and applications that span multiple areas of study.",
    },
    {
      front: "What are the career opportunities in this field?",
      back: "Career opportunities include research positions, teaching, industry applications, consulting, and specialized roles in various sectors.",
    },
    {
      front: "How do you solve problems using scientific methods?",
      back: "Problem-solving involves identifying the problem, gathering information, forming hypotheses, testing solutions, and evaluating results systematically.",
    },
    {
      front: "What are the mathematical foundations required?",
      back: "Mathematical foundations include algebra, calculus, statistics, and other mathematical concepts necessary for understanding and applying scientific principles.",
    },
    {
      front: "How do you interpret scientific data and graphs?",
      back: "Data interpretation involves understanding variables, relationships, trends, patterns, and drawing valid conclusions from scientific evidence.",
    },
    {
      front: "What are the safety protocols and procedures?",
      back: "Safety protocols include protective equipment, proper procedures, risk assessment, and emergency response plans for laboratory and field work.",
    },
    {
      front: "How do you write and present scientific findings?",
      back: "Scientific communication involves clear writing, proper citation, logical organization, and effective presentation of methods, results, and conclusions.",
    },
    {
      front: "What are the environmental and societal impacts?",
      back: "Environmental and societal impacts include effects on ecosystems, human health, economic development, and quality of life considerations.",
    },
    {
      front: "How do you evaluate the quality of scientific sources?",
      back: "Source evaluation involves checking peer review, author credentials, methodology, evidence quality, and publication in reputable journals.",
    },
    {
      front: "What are the future directions and challenges?",
      back: "Future directions include emerging technologies, unresolved questions, new applications, and challenges that require innovative solutions.",
    },
  ];

  return scienceCards;
}

function generateGeneralCards(title: string, description: string) {
  const generalCards = [
    {
      front: `What is the main focus of "${title}"?`,
      back: `${title} focuses on ${
        description || "essential concepts and principles"
      } that are fundamental to understanding this subject area.`,
    },
    {
      front: `What are the key concepts in "${title}"?`,
      back: `Key concepts include fundamental principles, core theories, and essential elements that form the foundation of ${title.toLowerCase()}.`,
    },
    {
      front: `How can you apply "${title}" in practice?`,
      back: `Practical applications involve using the concepts and principles of ${title.toLowerCase()} to solve real-world problems and achieve specific goals.`,
    },
    {
      front: `What are the fundamental principles of "${title}"?`,
      back: `Fundamental principles are the basic rules, laws, and concepts that govern how ${title.toLowerCase()} works and can be applied.`,
    },
    {
      front: `How does "${title}" relate to other subjects?`,
      back: `${title} connects to other subjects through shared principles, complementary knowledge, and interdisciplinary applications.`,
    },
    {
      front: `What are common challenges when learning "${title}"?`,
      back: `Common challenges include understanding complex concepts, applying theoretical knowledge, maintaining motivation, and developing practical skills.`,
    },
    {
      front: `What resources are available for studying "${title}"?`,
      back: `Study resources include textbooks, online courses, practice exercises, expert guidance, and practical applications.`,
    },
    {
      front: `How do you measure progress in "${title}"?`,
      back: `Progress can be measured through assessments, practical applications, skill demonstrations, and continuous improvement.`,
    },
    {
      front: `What are the benefits of understanding "${title}"?`,
      back: `Understanding ${title.toLowerCase()} provides benefits like improved skills, better decision-making, and enhanced problem-solving abilities.`,
    },
    {
      front: `How has "${title}" evolved over time?`,
      back: `${title} has evolved through new discoveries, improved methods, technological advances, and better understanding of principles.`,
    },
    {
      front: `What are current trends in "${title}"?`,
      back: `Current trends include new methodologies, technological innovations, emerging applications, and evolving best practices.`,
    },
    {
      front: `How do you solve problems using "${title}"?`,
      back: `Problem-solving involves applying the principles and methods of ${title.toLowerCase()} systematically to identify and implement solutions.`,
    },
    {
      front: `What are the career applications of "${title}"?`,
      back: `Career applications include specialized roles, consulting opportunities, research positions, and practical applications in various industries.`,
    },
    {
      front: `How do you stay updated with "${title}" developments?`,
      back: `Staying updated involves following current research, reading professional literature, attending conferences, and continuous learning.`,
    },
    {
      front: `What are the ethical considerations in "${title}"?`,
      back: `Ethical considerations include responsible practices, consideration of consequences, and adherence to professional standards.`,
    },
    {
      front: `How do you teach others about "${title}"?`,
      back: `Teaching involves breaking down complex concepts, providing examples, encouraging practice, and adapting to different learning styles.`,
    },
    {
      front: `What are the research opportunities in "${title}"?`,
      back: `Research opportunities include exploring new questions, developing innovative methods, and contributing to the advancement of knowledge.`,
    },
    {
      front: `How do you collaborate with others in "${title}"?`,
      back: `Collaboration involves sharing knowledge, working on joint projects, learning from others, and contributing to team efforts.`,
    },
    {
      front: `What are the global perspectives on "${title}"?`,
      back: `Global perspectives include cultural variations, international standards, and diverse approaches to understanding and application.`,
    },
    {
      front: `How can you contribute to the field of "${title}"?`,
      back: `Contributions can include research, innovation, teaching, sharing knowledge, and applying expertise to advance the field.`,
    },
  ];

  return generalCards;
}

// Fallback function for when OpenAI is not available
function generateBasicFallbackCards(title: string, description: string) {
  const isLanguage =
    /language|portuguese|spanish|french|german|italian|english|vocabulary|grammar|verbs|nouns|pronunciation/i.test(
      title + " " + description
    );

  if (isLanguage) {
    return [
      { front: "Hello", back: "A greeting used when meeting someone" },
      { front: "Goodbye", back: "A farewell when leaving someone" },
      { front: "Please", back: "A polite word used when making a request" },
      { front: "Thank you", back: "An expression of gratitude" },
      { front: "You're welcome", back: "A polite response to 'thank you'" },
      { front: "Sorry", back: "An expression of apology or regret" },
      { front: "Yes", back: "An affirmative response" },
      { front: "No", back: "A negative response" },
      {
        front: "I don't understand",
        back: "A phrase used when you don't comprehend something",
      },
      {
        front: "Speak more slowly",
        back: "A request for someone to talk at a slower pace",
      },
      {
        front: "How do you say...?",
        back: "A question asking for the translation of a word or phrase",
      },
      {
        front: "Where is...?",
        back: "A question asking for the location of something",
      },
      {
        front: "What time is it?",
        back: "A question asking for the current time",
      },
      {
        front: "How much does it cost?",
        back: "A question asking for the price of something",
      },
      {
        front: "I like...",
        back: "A phrase expressing positive feelings about something",
      },
      {
        front: "I don't like...",
        back: "A phrase expressing negative feelings about something",
      },
      {
        front: "Nice to meet you",
        back: "A phrase used when meeting someone for the first time",
      },
      {
        front: "Excuse me",
        back: "A phrase used to get someone's attention or apologize",
      },
      { front: "Good morning", back: "A greeting used in the morning" },
      { front: "Good evening", back: "A greeting used in the evening" },
      { front: "Good night", back: "A farewell used at night" },
    ];
  } else {
    return [
      {
        front: `What is the main focus of "${title}"?`,
        back: `${title} focuses on ${
          description || "essential concepts and principles"
        } that are fundamental to understanding this subject area.`,
      },
      {
        front: `What are the key concepts in "${title}"?`,
        back: `Key concepts include fundamental principles, core theories, and essential elements that form the foundation of ${title.toLowerCase()}.`,
      },
      {
        front: `How can you apply "${title}" in practice?`,
        back: `Practical applications involve using the concepts and principles of ${title.toLowerCase()} to solve real-world problems and achieve specific goals.`,
      },
      {
        front: `What are the fundamental principles of "${title}"?`,
        back: `Fundamental principles are the basic rules, laws, and concepts that govern how ${title.toLowerCase()} works and can be applied.`,
      },
      {
        front: `How does "${title}" relate to other subjects?`,
        back: `${title} connects to other subjects through shared principles, complementary knowledge, and interdisciplinary applications.`,
      },
      {
        front: `What are common challenges when learning "${title}"?`,
        back: `Common challenges include understanding complex concepts, applying theoretical knowledge, maintaining motivation, and developing practical skills.`,
      },
      {
        front: `What resources are available for studying "${title}"?`,
        back: `Study resources include textbooks, online courses, practice exercises, expert guidance, and practical applications.`,
      },
      {
        front: `How do you measure progress in "${title}"?`,
        back: `Progress can be measured through assessments, practical applications, skill demonstrations, and continuous improvement.`,
      },
      {
        front: `What are the benefits of understanding "${title}"?`,
        back: `Understanding ${title.toLowerCase()} provides benefits like improved skills, better decision-making, and enhanced problem-solving abilities.`,
      },
      {
        front: `How has "${title}" evolved over time?`,
        back: `${title} has evolved through new discoveries, improved methods, technological advances, and better understanding of principles.`,
      },
      {
        front: `What are current trends in "${title}"?`,
        back: `Current trends include new methodologies, technological innovations, emerging applications, and evolving best practices.`,
      },
      {
        front: `How do you solve problems using "${title}"?`,
        back: `Problem-solving involves applying the principles and methods of ${title.toLowerCase()} systematically to identify and implement solutions.`,
      },
      {
        front: `What are the career applications of "${title}"?`,
        back: `Career applications include specialized roles, consulting opportunities, research positions, and practical applications in various industries.`,
      },
      {
        front: `How do you stay updated with "${title}" developments?`,
        back: `Staying updated involves following current research, reading professional literature, attending conferences, and continuous learning.`,
      },
      {
        front: `What are the ethical considerations in "${title}"?`,
        back: `Ethical considerations include responsible practices, consideration of consequences, and adherence to professional standards.`,
      },
      {
        front: `How do you teach others about "${title}"?`,
        back: `Teaching involves breaking down complex concepts, providing examples, encouraging practice, and adapting to different learning styles.`,
      },
      {
        front: `What are the research opportunities in "${title}"?`,
        back: `Research opportunities include exploring new questions, developing innovative methods, and contributing to the advancement of knowledge.`,
      },
      {
        front: `How do you collaborate with others in "${title}"?`,
        back: `Collaboration involves sharing knowledge, working on joint projects, learning from others, and contributing to team efforts.`,
      },
      {
        front: `What are the global perspectives on "${title}"?`,
        back: `Global perspectives include cultural variations, international standards, and diverse approaches to understanding and application.`,
      },
      {
        front: `How can you contribute to the field of "${title}"?`,
        back: `Contributions can include research, innovation, teaching, sharing knowledge, and applying expertise to advance the field.`,
      },
      {
        front: `What are the future directions for "${title}"?`,
        back: `Future directions include emerging technologies, unresolved questions, new applications, and challenges that require innovative solutions.`,
      },
    ];
  }
}
