import { useState } from "react";
import { FileEdit, Trash2, Plus, Save } from "lucide-react";
import * as m from "@/paraglide/messages.js";
import db from "@/lib/utils/db";
import LanguageSwitcher from "@/app/_components/LanguageSwitcher";
import { addRule, deleteRule, updateRule } from "./actionts";
import { RuleRow } from "./_components/RuleRow";
import AddRuleButton from "./_components/AddRule";

export default async function RulesAdminPage() {
  const rules = await db.rule.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { ruleRides: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Dashboard Header */}
      <div className="sticky top-0 left-0 z-20 w-full bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold line-clamp-1">
              {m.minor_quaint_wallaby_scold()}
            </h1>
            <p className="text-sm text-gray-800 mt-1 line-clamp-1">
              {m.large_patient_vole_commend()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Header with Add Button */}
        <section className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {m.jumpy_moving_dove_stir()}
            </h2>
            <AddRuleButton />
          </div>
        </section>

        {/* Rules List */}
        <section>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            {/* Desktop and tablet table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-700 text-sm">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      {m.simple_key_coyote_cut()}
                    </th>
                    <th className="px-4 py-3 text-left">
                      {m.elegant_keen_swallow_wish()}
                    </th>
                    <th className="px-4 py-3 text-left">
                      {m.any_royal_pony_breathe()}
                    </th>
                    <th className="px-4 py-3 text-right">
                      {m.aqua_tiny_koala_snip()}
                    </th>
                    <th className="px-4 py-3 text-right">
                      {m.caring_pink_piranha_work()}
                    </th>
                    <th className="px-4 py-3 text-center">
                      {m.wide_spare_gadfly_arrive()}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rules.map((rule) => (
                    <RuleRow key={rule.id} rule={rule} />
                  ))}
                  {rules.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-gray-500"
                      >
                        {m.candid_mellow_skunk_endure()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile list view */}
            <table className="md:hidden w-full">
              <thead>
                <tr>
                  <th className="bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                    {m.sour_merry_kudu_nudge()}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rules.map((rule) => (
                  <RuleRow key={rule.id} rule={rule} />
                ))}
                {rules.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-gray-500 px-4"
                    >
                      {m.cool_such_sloth_file()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
