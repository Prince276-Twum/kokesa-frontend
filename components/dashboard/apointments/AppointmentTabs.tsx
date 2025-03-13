import React from "react";
import TabNavigation, {
  TabOption,
} from "@/components/dashboard/apointments/TabNavigation";
import ViewToggle, {
  ViewOption,
} from "@/components/dashboard/apointments/ViewToggle";

interface AppointmentTabsProps {
  tabOptions: TabOption[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewOptions: ViewOption[];
  viewMode: string;
  setViewMode: (mode: string) => void;
}

export const AppointmentTabs: React.FC<AppointmentTabsProps> = ({
  tabOptions,
  activeTab,
  setActiveTab,
  viewOptions,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 md:p-4 border-b">
      {/* Mobile and desktop tabs */}
      <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <TabNavigation
          tabs={tabOptions}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="underline"
          size="md"
        />
      </div>

      {/* Mobile and desktop view toggle */}
      <div className="mt-2 md:mt-0 self-end md:self-auto">
        <ViewToggle
          options={viewOptions}
          activeView={viewMode}
          onViewChange={setViewMode}
          variant="default"
        />
      </div>
    </div>
  );
};
