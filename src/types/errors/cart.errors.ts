import { AppError } from "../../utils/AppError";

export class CartProductNotFound extends AppError {
  constructor() {
    super("Produit non trouvé", 404, [], "CART_PRODUCT_NOT_FOUND");
  }
}

export class CartInvalidPlan extends AppError {
  constructor() {
    super("Type d'abonnement invalide", 400, [], "CART_INVALID_PLAN");
  }
}

export class CartItemExists extends AppError {
  constructor() {
    super("L'utilisateur possède déjà cet article dans son panier", 400, [], "CART_ITEM_EXISTS");
  }
}

export class CartDifferentPlans extends AppError {
  constructor() {
    super("Vous ne pouvez pas posséder plusieurs types d'abonnements différents dans votre panier", 400, [], "DIFFERENT_PLANS");
  }
}

export class CartAlreadySubscribed extends AppError {
  constructor() {
    super("L'utilisateur est déjà abonné à ce produit", 400, [], "ALREADY_SUBSCRIBED");
  }
}

export class CartUpdateFailed extends AppError {
  constructor() {
    super("Impossible de mettre à jour le panier", 500, [], "CART_UPDATE_FAILED");
  }
}

export class CartNotFound extends AppError {
  constructor() {
    super("Panier non trouvé", 404, [], "CART_NOT_FOUND");
  }
}

export class CartNotReady extends AppError {
  constructor() {
    super("Vous ne pouvez pas mettre à jour le panier lors d'un paiement", 400, [], "CART_NOT_READY");
  }
}

export class CartInvalidStatus extends AppError {
  constructor() {
    super("Le statut du panier est invalide", 400, [], "CART_INVALID_STATUS");
  }
}
