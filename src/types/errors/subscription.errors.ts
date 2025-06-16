import { AppError } from "../../utils/AppError";

export class SubscriptionAlreadyExists extends AppError {
  constructor() {
    super("L'utilisateur est déjà abonné à ce produit", 400, [], "SUBSCRIPTION_ALREADY_EXISTS");
  }
}

export class SubscriptionNotFound extends AppError {
  constructor() {
    super("Abonnement non trouvé", 404, [], "SUBSCRIPTION_NOT_FOUND");
  }
}

export class SubscriptionDeleteFailed extends AppError {
  constructor() {
    super("Échec de la suppression de l'abonnement", 500, [], "SUBSCRIPTION_DELETE_FAILED");
  }
}

export class UnauthorizedSubscriptionAccess extends AppError {
  constructor() {
    super("Accès non autorisé à l'abonnement", 403, [], "UNAUTHORIZED_SUBSCRIPTION_ACCESS");
  }
}