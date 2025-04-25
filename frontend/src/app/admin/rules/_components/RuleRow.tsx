"use client";
import {
  FileEdit,
  Save,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { updateRule } from "../actionts";
import { useState } from "react";
import { toast } from "react-hot-toast"; // Add toast for notifications
import * as m from "@/paraglide/messages.js";
import addRule from "../_actions/addRule";
import addRuleSchema from "../_schemas/addRuleSchema";
import { useFormWithServerAction } from "@/hooks/useFormWithServerAction";
import DeleteRuleModal from "./DeleteRuleModal";
import { Prisma } from "@prisma/client";

export function AddRuleButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { form, handleSubmit, loading, firstError, reset } =
    useFormWithServerAction(
      addRule,
      addRuleSchema,
      {
        enLabel: "",
        kaLabel: "",
        price: 0,
        svg: "",
      },
      {
        onSuccess: (data) => {
          setIsModalOpen(false);
          reset();
        },
        onError: (_, err) => {
          console.error(err);
        },
        showErrorToast: true,
        showSuccessToast: true,
      }
    );

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;
  const priceValue = watch("price");

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2"
      >
        Add New Rule
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-auto m-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Add New Rule</h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label (English)
                  </label>
                  <input
                    {...register("enLabel")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="No Smoking"
                  />
                  {errors.enLabel && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.enLabel.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label (Georgian)
                  </label>
                  <input
                    {...register("kaLabel")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="არ ვეწევით"
                  />
                  {errors.kaLabel && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.kaLabel.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    // {...register("price")}
                    value={priceValue === 0 ? "" : priceValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === "" ? 0 : parseFloat(value);
                      setValue("price", numValue, { shouldValidate: true });
                    }}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="25.00"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SVG Icon
                  </label>
                  <textarea
                    {...register("svg")}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="<svg>...</svg>"
                  ></textarea>
                  {errors.svg && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.svg.message}
                    </p>
                  )}
                </div>

                {firstError && (
                  <div className="text-red-500 text-sm">
                    {firstError.message}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <span>Loading...</span>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Rule
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function RuleRow({
  rule,
}: {
  rule: Prisma.RuleGetPayload<{
    include: {
      _count: {
        select: { ruleRides: true };
      };
    };
  }>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const ruleLabels = rule.labels as any;
  return (
    <>
      <tr className="hidden md:table-row hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md">
            {rule.svg ? (
              <div
                className="w-7 h-7"
                dangerouslySetInnerHTML={{ __html: rule.svg }}
              />
            ) : (
              <span className="text-xs text-gray-400">No icon</span>
            )}
          </div>
        </td>
        <td className="px-4 py-3">{ruleLabels.en}</td>
        <td className="px-4 py-3">{ruleLabels.ka}</td>
        <td className="px-4 py-3 text-right">{rule.price.toFixed(2)}₾</td>
        <td className="px-4 py-3 text-right">{rule._count.ruleRides}</td>
        <td className="px-4 py-3">
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
            >
              <FileEdit className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1.5 text-red-600 bg-red-100 rounded-md hover:bg-red-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      <tr className="md:hidden border-b hover:bg-gray-50 w-full block">
        <td className="p-4 w-full block">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md">
                {rule.svg ? (
                  <div
                    className="w-7 h-7"
                    dangerouslySetInnerHTML={{
                      __html: rule.svg,
                    }}
                  />
                ) : (
                  <span className="text-xs text-gray-400">No icon</span>
                )}
              </div>
              <div>
                <div className="font-medium">{ruleLabels.en}</div>
                <div className="text-sm text-gray-500">{ruleLabels.ka}</div>
              </div>
            </div>
            <button
              onClick={toggleExpand}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="mt-3 pl-12 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {m.least_silly_lamb_accept()}
                </span>
                <span className="font-medium">{rule.price.toFixed(2)}₾</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {m.tough_new_fireant_read()}
                </span>
                <span className="font-medium">{rule._count.ruleRides}</span>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1.5 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                >
                  <FileEdit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-1.5 text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </td>
      </tr>

      {isEditModalOpen && (
        <EditRuleModal
          rule={rule}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteRuleModal
          rule={rule}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}

export function EditRuleModal({
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
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  if (!isOpen) return null;

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    setError(null); // Reset error

    try {
      const result = await updateRule(formData);
      if (result.success) {
        toast.success("Rule updated successfully");
        onClose();
      } else {
        setError("Failed to update rule");
        toast.error("Failed to update rule");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const ruleLabels = rule.labels as any;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-auto m-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Edit Rule</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpdate}>
          <input type="hidden" name="id" value={rule.id} />
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label (English)
              </label>
              <input
                name="labelEn"
                required
                defaultValue={ruleLabels.en}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label (Georgian)
              </label>
              <input
                name="labelKa"
                required
                defaultValue={ruleLabels.ka}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={rule.price}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SVG Icon
              </label>
              <textarea
                name="svg"
                required
                rows={4}
                defaultValue={rule.svg}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading} // Disable button during loading
                className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Rule
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
