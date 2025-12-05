import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  defaultSubject?: string;
}

export function ContactForm({ defaultSubject }: ContactFormProps) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactFormData>({
    defaultValues: {
      subject: defaultSubject || ''
    }
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock tracking ID
    const newTrackingId = `MM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    setTrackingId(newTrackingId);
    
    console.log('Form submitted to support@masseurmatch.com:', { ...data, trackingId: newTrackingId });
    
    setIsSuccess(true);
    toast.success("Message received. A support ticket has been created.");
    reset();
  };

  if (isSuccess) {
    return (
      <Card className="w-full border-green-500/20 bg-green-50/50 dark:bg-green-950/10">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Message Received</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Thank you for contacting us. Your tracking number is:
            </p>
            <div className="bg-background border rounded-md py-2 px-4 font-mono text-lg font-bold select-all">
              {trackingId}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              A member of our team will review your request and respond to <strong>support@masseurmatch.com</strong> within 24-48 hours.
            </p>
          </div>
          <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full" id="contact-form">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Need help? Fill out the form below. All inquiries are routed to <strong>support@masseurmatch.com</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" {...register('name', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" {...register('email', { required: true })} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="How can we help?" {...register('subject', { required: true })} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              placeholder="Please describe your issue or question..." 
              className="min-h-[120px]"
              {...register('message', { required: true })} 
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Protected by reCAPTCHA and subject to the Privacy Policy.
            </p>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : 'Send Message'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
