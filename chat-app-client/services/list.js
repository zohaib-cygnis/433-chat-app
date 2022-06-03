export const getUsersList = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`);
  if (response.ok) {
    return await data.json();
  }
};
