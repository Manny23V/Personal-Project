import { useState } from "react";
import Button from "./Button.jsx";

const CreateCommentForm = ({ parentCommentId = null, onClose, onSubmit }) => {
  const [body, setBody] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-lg bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-300 p-4">
            <h2 className="font-semibold text-lg text-primary-500">
              Add comment
            </h2>

            {/* close modal */}
            <Button
              type="button"
              onClick={onClose}
              variant="base"
              className="text-sm text-red-500 outline outline-red-500"
            >
              x
            </Button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(body, parentCommentId);
              onClose();
            }}
            className="p-4"
          >
            {/* comment body */}
            <textarea
              name="body"
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your comment..."
              className="w-full rounded-lg border border-gray-300 shadow-sm p-3 resize-none outline-none focus:border-primary-500"
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button type="submit">Post Comment</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCommentForm;
