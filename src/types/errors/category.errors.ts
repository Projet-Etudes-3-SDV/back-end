import { AppError } from "../../utils/AppError";

export class CategoryAlreadyExists extends AppError {
  constructor() {
    super("Une catégorie avec ce nom existe déjà", 400, [], "CATEGORY_ALREADY_EXISTS");
  }
}

export class CategoryNotFound extends AppError {
  constructor() {
    super("Catégorie non trouvée", 404, [], "CATEGORY_NOT_FOUND");
  }
}

export class CategoryUpdateFailed extends AppError {
  constructor() {
    super("Échec de la mise à jour de la catégorie", 500, [], "CATEGORY_UPDATE_FAILED");
  }
}

export class CategoryDeleteFailed extends AppError {
  constructor() {
    super("Échec de la suppression de la catégorie", 500, [], "CATEGORY_DELETE_FAILED");
  }
}
