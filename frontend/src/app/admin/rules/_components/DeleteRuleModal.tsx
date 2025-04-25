import { useServerAction } from "@/hooks/useServerAction";
import { Prisma } from "@prisma/client";
import deleteRule from "../_actions/deleteRule";
import { Trash2, X } from "lucide-react";
import * as m from "@/paraglide/messages.js";

export default function DeleteRuleModal({
  rule,
  isOpen,
  onClose,
}: {
  rule: Prisma.RuleGetPayload<{
    include: {
      _count: {
        select: { ruleRides: true };
      };
    };
  }>;
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    execute: executeDelete,
    loading,
    firstError,
  } = useServerAction(deleteRule, {
    onSuccess: (d) => {
      console.log(d.message);
      onClose();
    },
    onError: (_, err) => {
      console.error(err);
    },
    showErrorToast: true,
    showSuccessToast: true,
  });

  if (!isOpen) return null;

  const handleDelete = () => {
    executeDelete({
      id: rule.id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-auto m-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">
            {m.proud_shy_rooster_jest()}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p>{m.active_basic_haddock_file()}</p>

          {firstError && (
            <div className="text-red-500 text-sm">{firstError.message}</div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={onClose}
            >
              {m.great_due_falcon_embrace()}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span>{m.witty_left_flamingo_snap()}</span>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {m.silly_icy_vole_blend()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
