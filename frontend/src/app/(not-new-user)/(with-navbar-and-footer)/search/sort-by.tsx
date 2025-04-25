"use client";
import { defaultSortBy, sortByOptions } from "@/lib/constants/search";
import { languageTag } from "@/paraglide/runtime";
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import * as m from "@/paraglide/messages.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { ArrowDownAz, ArrowDownWideNarrow } from "lucide-react";

export default function SortBy({ search }: { search: any }) {
  const [orderBy, setOrderBy] = useQueryState(
    "sortBy",
    parseAsString.withDefault(defaultSortBy)
  );

  const [_, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <div className="block lg:hidden">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger className="flex items-center gap-1 justify-center p-3 w-full bg-white border rounded-lg">
            {/* <ArrowDownAz /> */}
            {m.royal_teary_cougar_edit()}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerDescription className="flex flex-col gap-2">
                {sortByOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center p-3 h-14 w-full bg-white border shadow-sm rounded-lg text-sm focus:border-primary focus:ring-primary"
                  >
                    <input
                      type="radio"
                      className="shrink-0 mt-0.5  rounded-full text-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none "
                      value={option.value}
                      checked={orderBy === option.value}
                      onChange={(e) => {
                        setPage(1);
                        setOrderBy(e.target.value);
                        setOpen(false);
                        search();
                      }}
                    />
                    <span className="text-sm  ms-3">
                      {option.label[languageTag()]}
                    </span>
                  </label>
                ))}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose className="w-full">
                <Button className="w-full">დახურვა</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="hidden lg:block">
        <Accordion type="single" collapsible defaultValue="item-2">
          <AccordionItem value="item-1">
            <AccordionTrigger className="pt-0 pb-2">
              <div className="text-xl font-semibold mb-2">
                {m.royal_teary_cougar_edit()}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-[calc(100vw-5rem)] lg:flex flex-col lg:w-auto space-x-2 lg:space-x-0 gap-2 overflow-x-auto min-w-0 whitespace-nowrap">
                {sortByOptions.map((option) => (
                  <label
                    key={option.value}
                    className="min-w-[100px] max-w-[300px] inline-flex items-center p-3 h-14 w-full bg-white border shadow-sm rounded-lg text-sm focus:border-primary focus:ring-primary"
                  >
                    <input
                      type="radio"
                      className="shrink-0 mt-0.5  rounded-full text-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none "
                      value={option.value}
                      checked={orderBy === option.value}
                      onChange={(e) => {
                        setPage(1);
                        setOrderBy(e.target.value);
                        search();
                      }}
                    />
                    <span className="text-sm  ms-3">
                      {option.label[languageTag()]}
                    </span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
