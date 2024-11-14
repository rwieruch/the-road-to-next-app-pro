import { Heading } from "@/components/heading";
import { AccountTabs } from "../_navigation/tabs";

const ProfilePage = () => {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Profile"
        description="All your profile information"
        tabs={<AccountTabs />}
      />
    </div>
  );
};

export default ProfilePage;
