import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export function CommentTable({
  comments,
}: {
  comments: { text: string; mood: string }[] | undefined;
}) {
  return (
    <div className="m-6">
      <Table>
        <TableCaption>A comments list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Text</TableHead>
            <TableHead className="w-[100px]">Mood</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments?.map((cmt, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{cmt.text}</TableCell>
              <TableCell>{cmt.mood}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  );
}
