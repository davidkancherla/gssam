export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action="/api/logout" method="post">
      <button className={className} type="submit">
        Sign out
      </button>
    </form>
  );
}
