import { motion } from "framer-motion";
import { Heart, Gift } from "lucide-react";
import { Card } from "./ui/card";

export interface BankAccount {
  bank: string;
  accountName: string;
  accountNumber: string;
}

export interface GiftsSectionProps {
  heading?: string;
  message?: string[];
  footnote?: string;
  showAccountDetails?: boolean;
  accounts?: BankAccount[];
  registryLink?: string;
}

const GiftsSection = ({
  heading = "In Lieu of Gifts",
  message = [
    "We are truly blessed with all that we have. Your presence and prayers are the greatest gifts we could ask for.",
    "However, if you wish to honor us with a gift, a small contribution toward our future adventures together would be deeply appreciated and will help us start this new chapter of our lives.",
  ],
  footnote = "Thank you for being part of our journey. Your love means everything to us.",
  showAccountDetails = false,
  accounts = [],
  registryLink,
}: GiftsSectionProps = {}) => {
  return (
    <section className="relative pt-20 pb-[200px] px-4" style={{ background: "var(--gradient-sage)" }}>
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="border-none bg-card/80 backdrop-blur-sm p-10 md:p-16 shadow-xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <div className="rounded-full bg-primary/10 p-6">
                  <Gift className="h-12 w-12 text-primary" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2"
                >
                  <Heart className="h-6 w-6 text-primary fill-primary" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8 text-4xl md:text-5xl font-bold text-foreground"
            >
              {heading}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6 text-lg text-muted-foreground leading-relaxed"
            >
              {message.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </motion.div>

            {showAccountDetails && accounts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="mt-8 space-y-4"
              >
                {accounts.map((acct) => (
                  <div key={acct.accountNumber} className="rounded-lg border bg-background/60 p-4 text-left">
                    <p className="text-sm font-medium text-muted-foreground">{acct.bank}</p>
                    <p className="font-semibold text-foreground">{acct.accountName}</p>
                    <p className="font-mono text-lg text-primary">{acct.accountNumber}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {registryLink && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-6"
              >
                <a
                  href={registryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2 text-sm text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  View Registry
                </a>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 pt-8 border-t border-border"
            >
              <p className="text-sm text-muted-foreground italic">{footnote}</p>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftsSection;
