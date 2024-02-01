import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import SpinLoader from "../loader";

export function CommentTable({
  comments,
}: {
  comments: { id: string; comment: string; sentiment: string }[] | undefined;
}) {
  if (!comments) {
    return (
      <div className="h-screen flex justify-center items-center">
        <SpinLoader />
        <h1>Analysing comments</h1>
      </div>
    );
  }
  return (
    <>
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
            {comments?.map((cmt) => (
              <TableRow key={cmt.id}>
                <TableCell className="font-medium">{cmt.comment}</TableCell>
                <TableCell>
                  {cmt.sentiment == "neutral"
                    ? "😐  "
                    : cmt.sentiment == "positive"
                    ? "😀  "
                    : cmt.sentiment == "negative"
                    ? "😡  "
                    : ""}
                  {cmt.sentiment}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
