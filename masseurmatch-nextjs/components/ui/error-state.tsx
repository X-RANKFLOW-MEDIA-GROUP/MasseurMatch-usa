"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./button";
import { cn } from "./utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We're having trouble loading this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-center justify-center min-h-[400px]", className)}
    >
      <div className="text-center space-y-4 max-w-md px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto"
        >
          <AlertCircle className="w-10 h-10 text-red-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-slate-400 leading-relaxed">{description}</p>
        </motion.div>

        {onRetry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={onRetry}
              variant="outline"
              className="mt-4 gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
