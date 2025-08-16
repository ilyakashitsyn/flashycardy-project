import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CardDemoPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Card Component</h1>
        <p className="text-lg text-muted-foreground">
          Displays a card with header, content, and footer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Card</CardTitle>
            <CardDescription>
              Simple card with title and description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a basic card component with minimal content.</p>
          </CardContent>
        </Card>

        {/* Card with Action */}
        <Card>
          <CardHeader>
            <CardTitle>Card with Action</CardTitle>
            <CardDescription>Card featuring an action button</CardDescription>
            <CardAction>
              <Button size="sm">Action</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>This card includes an action button in the header.</p>
          </CardContent>
        </Card>

        {/* Card with Footer */}
        <Card>
          <CardHeader>
            <CardTitle>Card with Footer</CardTitle>
            <CardDescription>Card with footer content</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content of the card goes here.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Footer Action
            </Button>
          </CardFooter>
        </Card>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Form Card</CardTitle>
            <CardDescription>Card containing a form</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Submit</Button>
          </CardFooter>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
            <CardDescription>Important information display</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Status:</strong> Active
              </p>
              <p className="text-sm">
                <strong>Last Updated:</strong> Today
              </p>
              <p className="text-sm">
                <strong>Priority:</strong> High
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle>Interactive Card</CardTitle>
            <CardDescription>Hover to see effects</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This card has hover effects and is interactive.</p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full">
              Learn More
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
