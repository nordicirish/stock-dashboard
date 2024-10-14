import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TermsModalProps {
  onClose: () => void;
}

export function TermsModal({ onClose }: TermsModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
          <p className="mb-4">
            By accessing and using this stock portfolio management service, you
            agree to be bound by these Terms and Conditions, all applicable laws
            and regulations, and agree that you are responsible for compliance
            with any applicable local laws.
          </p>
          <h3 className="text-lg font-semibold mb-2">2. Use License</h3>
          <p className="mb-4">
            Permission is granted to temporarily use this service for personal,
            non-commercial transitory viewing only. This is the grant of a
            license, not a transfer of title, and under this license you may
            not:
            <ul className="list-disc list-inside mt-2">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose;</li>
              <li>
                attempt to decompile or reverse engineer any software contained
                in the service;
              </li>
              <li>
                remove any copyright or other proprietary notations from the
                materials; or
              </li>
              <li>
                transfer the materials to another person or &quot;mirror&quot;
                the materials on any other server.
              </li>
            </ul>
          </p>
          <h3 className="text-lg font-semibold mb-2">3. Disclaimer</h3>
          <p className="mb-4">
            The materials on this service are provided on an &apos;as is&apos;
            basis. We make no warranties, expressed or implied, and hereby
            disclaim and negate all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
          <h3 className="text-lg font-semibold mb-2">4. Limitations</h3>
          <p className="mb-4">
            In no event shall we or our suppliers be liable for any damages
            (including, without limitation, damages for loss of data or profit,
            or due to business interruption) arising out of the use or inability
            to use the materials on our service, even if we or an authorized
            representative has been notified orally or in writing of the
            possibility of such damage.
          </p>
          <h3 className="text-lg font-semibold mb-2">
            5. Accuracy of Materials
          </h3>
          <p className="mb-4">
            The materials appearing on our service could include technical,
            typographical, or photographic errors. We do not warrant that any of
            the materials on our service are accurate, complete or current. We
            may make changes to the materials contained on our service at any
            time without notice.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
