import { AppError } from "../../utils/AppError";

export class InvalidUserCredential extends AppError {
  constructor() {
    super("Email ou mot de passe invalide", 401, [], "INVALID_CREDENTIALS");
  }
}

export class UserAlreadyExists extends AppError {
  constructor() {
    super("Un utilisateur avec cet email existe déjà", 409, [], "USER_ALREADY_EXISTS");
  }
}

export class UserNotFound extends AppError {
  constructor() {
    super("Utilisateur non trouvé", 404, [], "USER_NOT_FOUND");
  }
}

export class UserDeletionFailed extends AppError {
  constructor() {
    super("Échec de la suppression de l'utilisateur", 500, [], "USER_DELETION_FAILED");
  }
}

export class UserNotAuthorized extends AppError {
  constructor() {
    super("Vous n'êtes pas autorisé à effectuer cette action", 403, [], "USER_NOT_AUTHORIZED");
  }
}

export class UserNotValidated extends AppError {
  constructor() {
    super("Votre compte n'est pas validé, veuillez vérifier votre email", 403, [], "USER_NOT_ACTIVE");
  }
}

export class UserAlreadyValidated extends AppError {
  constructor() {
    super("Votre compte est déjà validé", 400, [], "USER_ALREADY_VALIDATED");
  }
}


export class UserValidationTokenInvalid extends AppError {
  constructor() {
    super("Le token de validation de l'utilisateur est invalide ou a expiré", 400, [], "USER_VALIDATION_TOKEN_INVALID");
  }
}

export class UserPasswordResetTokenInvalid extends AppError {
  constructor() {
    super("Le token de réinitialisation du mot de passe est invalide ou a expiré", 400, [], "USER_PASSWORD_RESET_TOKEN_INVALID");
  }
}

export class UserAuthCodeExpired extends AppError {
  constructor() {
    super("Le code de connexion a expiré", 400, [], "USER_CODE_EXPIRED");
  }
}

export class UserAuthCodeInvalid extends AppError {
  constructor() {
    super("Le code de connexion est invalide", 400, [], "USER_CODE_INVALID");
  }
}

export class UserAuthCodeNotSet extends AppError {
  constructor() {
    super("Le code de connexion n'est pas défini", 400, [], "USER_CODE_NOT_SET");
  }
}

export class UserAdressNotFound extends AppError {
  constructor() {
    super("Adresse de l'utilisateur non trouvée", 404, [], "USER_ADDRESS_NOT_FOUND");
  }
}

export class UserFailedToUpdate extends AppError {
  constructor() {
    super("Échec de la mise à jour de l'utilisateur", 500, [], "USER_FAILED_TO_UPDATE");
  }
}