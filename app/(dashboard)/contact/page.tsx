'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Try multiple submission methods
    let success = false;
    
    // Method 1: Try the n8n webhook
    try {
      console.log('Attempting webhook submission...');
      const response = await fetch('https://n8n.jaxius.net/webhook/9b5def4e-cbd1-4512-8fdd-b8f10f300d74', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        mode: 'no-cors', // Try no-cors mode to avoid CORS issues
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          timestamp: new Date().toISOString(),
          source: 'LG Radar Dashboard'
        }),
      });

      // With no-cors, we can't read the response, so assume success if no error thrown
      success = true;
      console.log('Webhook submission successful');
    } catch (webhookError) {
      console.warn('Webhook submission failed:', webhookError);
      
      // Method 2: Try form-data format
      try {
        console.log('Attempting form-data submission...');
        const formDataPayload = new FormData();
        formDataPayload.append('name', formData.name);
        formDataPayload.append('email', formData.email);
        formDataPayload.append('subject', formData.subject);
        formDataPayload.append('message', formData.message);
        formDataPayload.append('timestamp', new Date().toISOString());
        formDataPayload.append('source', 'LG Radar Dashboard');

        const response2 = await fetch('https://n8n.jaxius.net/webhook/9b5def4e-cbd1-4512-8fdd-b8f10f300d74', {
          method: 'POST',
          mode: 'no-cors',
          body: formDataPayload,
        });

        success = true;
        console.log('Form-data submission successful');
      } catch (formError) {
        console.warn('Form-data submission failed:', formError);
        
        // Method 3: Fallback to mailto (always works)
        const mailtoLink = `mailto:lgradarwa@gmail.com.au?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;
        
        if (confirm('Direct submission failed. Would you like to open your email client to send the message?')) {
          window.location.href = mailtoLink;
          success = true;
        }
      }
    }

    if (success) {
      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      // Trigger confetti animation
      if (typeof window !== 'undefined' && (window as any).confetti) {
        (window as any).confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      alert('Failed to send message. Please contact us directly at lgradarwa@gmail.com.au or call +61 427 931 745');
    }
    
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Sent Successfully</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for contacting us. We typically respond within 2-4 hours.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Support</h1>
        <p className="text-muted-foreground">
          Get help with your account or provide feedback about LG Radar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Get in Touch</CardTitle>
              <CardDescription>
                We&apos;re here to help with any questions or issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-500/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-brand-500" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">lgradarwa@gmail.com.au</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+61 427 931 745</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available 9am-5pm AWST</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Monday - Friday</span>
                <Badge variant="outline">9:00 AM - 5:00 PM</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Saturday - Sunday</span>
                <Badge variant="secondary">Closed</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                All times are in Australian Western Standard Time (AWST)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide details about your question or issue..."
                    required
                    rows={6}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none">
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    We typically respond within 2-4 hours
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}