"use client";
import { useFormWithServerAction } from "@/hooks/useFormWithServerAction";
import { useState } from "react";
import addRule from "../_actions/addRule";
import addRuleSchema, {
  addRuleErrorMapClient,
} from "../_schemas/addRuleSchema";
import { Save, X } from "lucide-react";
import FormModal from "@/app/_components/forms/FormModal";
import FormField from "@/app/_components/forms/FormField";
import * as m from "@/paraglide/messages.js";

export default function AddRuleButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { form, clientErrors, handleSubmit, loading, firstError, reset } =
    useFormWithServerAction(
      addRule,
      addRuleSchema,
      addRuleErrorMapClient,
      {
        // enLabel: "",
        // kaLabel: "",
        // price: 0,
        // svg: "",
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

  const { register, setValue, watch } = form;
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
        {m.dizzy_spry_elk_believe()}
      </button>

      {isModalOpen && (
        <FormModal
          title={m.keen_trick_bulldog_aim()}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          loading={loading}
          firstError={firstError}
        >
          <FormField
            label={m.heroic_spicy_whale_succeed()}
            error={clientErrors.enLabel}
            input={
              <input
                {...register("enLabel")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="No Smoking"
              />
            }
          />

          <FormField
            label={m.real_seemly_anaconda_pat()}
            error={clientErrors.kaLabel}
            input={
              <input
                {...register("kaLabel")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="არ ვეწევით"
              />
            }
          />

          <FormField
            label={m.cuddly_cozy_hedgehog_emerge()}
            error={clientErrors.price}
            input={
              <input
                value={priceValue || ""}
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
            }
          />

          <FormField
            label={m.giant_tame_nils_cut()}
            error={clientErrors.svg}
            input={
              <textarea
                {...register("svg")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="<svg>...</svg>"
              />
            }
          />
        </FormModal>
      )}
    </>
  );
}
