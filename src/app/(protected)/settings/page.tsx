
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <>
      <h1 className="text-3xl font-headline font-bold animate-slide-in-up">Settings</h1>
      <div className="grid gap-8">
        <Card className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="font-headline">Profile</CardTitle>
            <CardDescription>
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Admin User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@pachabhoomi.com" />
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 mt-6">
            <Button>Save Profile</Button>
          </CardFooter>
        </Card>
        
        <Card className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="font-headline">Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">Select a theme for the dashboard.</p>
                </div>
                <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
