export const MeetingCard = ({
  title,
  date,
  description,
}: {
  title: string;
  date: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-1.5 rounded-md p-4 hover:bg-gray-100">
      <div className="flex justify-between">
        <h4 className="font-medium leading-none tracking-tight">{title}</h4>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};
