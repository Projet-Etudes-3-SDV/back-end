import { AppError } from "../../utils/AppError";

export class OrderNotFound extends AppError {
  constructor() {
    super("Commande non trouvée", 404, [], "ORDER_NOT_FOUND");
  }
}
