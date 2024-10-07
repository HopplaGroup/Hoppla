import { sendEmail } from "../send-email";
import { User } from "@prisma/client";
import { Html, Head } from "@react-email/components";
import HopplaMailTemplate from "./main";

export async function sendRideStatusToPassengerEmail({
  to,
  status,
}: {
  to: User[];
  status: "canceled" | "rejected" | "accepted";
  // here cancelled means the ride is cancelled by the driver or even by adrim in future maybe as well even it was accepted
}) {
  await sendEmail({
    to,
    subject: "Your ride status",
    senderName: "Hoppla",
    htmlRender: ({ user }: { user: User }) => {
      return (
        <HopplaMailTemplate
          previewMessage="მძღოლმა ნახა თქვენი მოთხოვნა"
          mainMessage={`${
            status === "canceled" &&
            "სამწუხაროდ, თქვენი მგზავრობა გაუქმებულია, მძღოლის ან ჩვენ მიერ. გთხოვთ შეამოწმოთ სხვა მგზავრობები, ჯავშნის თანხა დაგიბრუნდებათ ბალანსზე. ბოდიშს გიხდით ❤"
          } ${
            status === "rejected" &&
            "სამწუხაროდ, მძღოლმა უარგყოთ. თანხა დაგიბრუნდებათ ბალანსზე"
          } ${
            status === "accepted" &&
            "გილოცავთ, მძღოლმა დაგიდასტურათ ჯავშანი. პლატფორმაზე შეძლებთ მისი ტელეფონის ნომრის ნახვას, დაუკავშირდით და შეთანხმდით გადახდის პირობებზე"
          }`}
          secondaryMessage="Hoppla ❤ ბედნიერ მგზავრობას გისურვებთ 😎. კითხვების შემთხვევაში, გთხოვთ, დაგვიკავშირდით"
        />
      );
    },
  });
}
