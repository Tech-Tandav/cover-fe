"use client";
import { useState, useEffect } from "react";

export const useFetch = <T>(fetchMethod: () => Promise<T>, deps: string[]) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors

    try {
      const result = await fetchMethod(); // Await the fetch method

      setData(result); // Set the fetched data
    } catch (err) {
      setError("Failed to fetch data"); // Handle the error
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, deps);

  return { data, loading, error }; // Return data, loading state, and error
};

export const useCreate = <T, U>(createMethod: (data: U) => Promise<T>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createData = async (newData: U) => {
    setLoading(true);
    setError(null);
    try {
      await createMethod(newData);
    } catch (err) {
      setError("Failed to create data");
    } finally {
      setLoading(false);
    }
  };

  return { createData, loading, error };
};

export const useUpdate = <T, U>(
  updateMethod: (id: string, data: U) => Promise<T>
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = async (id: string, updatedData: U) => {
    setLoading(true);
    setError(null);
    try {
      await updateMethod(id, updatedData);
    } catch (err) {
      setError("Failed to update data");
    } finally {
      setLoading(false);
    }
  };

  return { updateData, loading, error };
};

export const useDelete = (deleteMethod: (id: string) => Promise<void>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMethod(id);
    } catch (err) {
      setError("Failed to delete data");
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, loading, error };
};

export const useResponsePost = <T, U>(
  createMethod: (data: U) => Promise<T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createData = async (newData: U) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createMethod(newData);
      setData(response);
    } catch (err) {
      setError("Failed to create data");
    } finally {
      setLoading(false);
    }
  };

  return { createData, loading, error, data };
};