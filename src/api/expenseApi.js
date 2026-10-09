const API_URL = "http://localhost:3000/api/v1/expenses";

export const createExpense = async (expense) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expense)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create expense");
  }

  return data;
};


export const deleteExpense = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete expense");
  }

  return data;
};