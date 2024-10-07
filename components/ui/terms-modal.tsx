import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  onClose: () => void;
}

export function TermsModal({ onClose }: TermsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Terms and Conditions</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
            <h2 className="text-lg font-bold mb-4">Terms and Conditions</h2>
            <p className="mb-4">
              Welcome to our service. By using our service, you agree to these
              terms. Please read them carefully.
            </p>
            <h3 className="font-semibold mb-2">1. Use of Service</h3>
            <p className="mb-4">
              You must follow any policies made available to you within the
              Service. Don&apos;t misuse our Services. For example, don&apos;t
              interfere with our Services or try to access them using a method
              other than the interface and the instructions that we provide.
            </p>
            <h3 className="font-semibold mb-2">2. Privacy</h3>
            <p className="mb-4">
              Our privacy policies explain how we treat your personal data and
              protect your privacy when you use our Services. By using our
              Services, you agree that we can use such data in accordance with
              our privacy policies.
            </p>
            <h3 className="font-semibold mb-2">3. Modifications</h3>
            <p className="mb-4">
              We may modify these terms or any additional terms that apply to a
              Service to, for example, reflect changes to the law or changes to
              our Services. You should look at the terms regularly.
            </p>
            <h3 className="font-semibold mb-2">4. Liabilities</h3>
            <p className="mb-4">
              When permitted by law, we will not be responsible for lost
              profits, revenues, or data, financial losses or indirect, special,
              consequential, exemplary, or punitive damages.
            </p>
            <h3 className="font-semibold mb-2">
              5. Business uses of our Services
            </h3>
            <p className="mb-4">
              If you are using our Services on behalf of a business, that
              business accepts these terms. It will hold harmless and indemnify
              us and our affiliates, officers, agents, and employees from any
              claim, suit or action arising from or related to the use of the
              Services.
            </p>
          </ScrollArea>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
