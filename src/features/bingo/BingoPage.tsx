import SignOutButton from "@/features/auth/components/SignOutButton";
export default function BingoPage() {
   return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bingo</h1>
        <SignOutButton />
      </div>

      <div className="mt-6">
        Bingo
      </div>
    </main>
  );
}
 