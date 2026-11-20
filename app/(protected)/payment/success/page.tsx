type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function PaymentSuccess({ searchParams }: Props) {
  const { session_id } = await searchParams;

  return (
    <main className="flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-green-600">
          Payment Successful!
        </h2>
        <p>Your payment has been received</p>
        <p className="text-sm text-gray-500">Session ID :{session_id}</p>
      </div>
    </main>
  );
}
