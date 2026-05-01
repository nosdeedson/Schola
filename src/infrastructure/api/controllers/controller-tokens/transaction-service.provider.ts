import { Provider } from "@nestjs/common";
import { TRANSACTION_SERVICE } from "./controller-tokens";
import { TransactionService } from "@/infrastructure/transaction-service/transaction-service";

export const transactionServiceProvider: Provider[] = [
    {
        provide: TRANSACTION_SERVICE,
        useClass: TransactionService
    }
]