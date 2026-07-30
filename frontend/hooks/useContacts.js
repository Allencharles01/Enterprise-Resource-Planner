"use client";

import { useCallback, useEffect, useState } from "react";
import * as crmService from "@/services/crmService";

export function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await crmService.getContacts({
        page,
        pageSize,
        search,
        filters,
      });

      setContacts(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError(
        err?.message || "Something went wrong while loading contacts."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, filters]);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 300);

    return () => clearTimeout(timer);
  }, [load]);

  return {
    contacts,
    total,

    page,
    pageSize,

    search,
    filters,

    isLoading,
    error,

    setPage,
    setPageSize,

    setSearch,
    setFilters,

    refresh: load,
  };
}

export function useCurrentContact() {
  const [current, setCurrent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noContactsLeft, setNoContactsLeft] = useState(false);

  const loadFirst = useCallback(async () => {
    setIsLoading(true);
    setNoContactsLeft(false);

    try {
      const contact = await crmService.getNextContact();

      setCurrent(contact);

      if (!contact) {
        setNoContactsLeft(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadNext = useCallback(async () => {
    setIsLoading(true);

    try {
      const next = await crmService.getNextContact(current?.id);

      setCurrent(next);

      if (!next) {
        setNoContactsLeft(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [current]);

  return {
    current,
    isLoading,
    noContactsLeft,

    loadFirst,
    loadNext,

    setCurrent,
  };
}