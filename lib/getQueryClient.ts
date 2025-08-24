import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// SSR-safe створення одного QueryClient на запит
const getQueryClient = cache(() => new QueryClient());

export default getQueryClient;
