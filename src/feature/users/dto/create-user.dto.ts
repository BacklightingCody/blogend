export class CreateUserDto {
  id?: number; // Auto-incremented, can be omitted when creating a new user
  username?: string; // Required but optional for DTO flexibility
  email?: string; // Required but optional for DTO flexibility
  password?: string; // Can be null or empty for OAuth users
  bio?: string; // Optional field
  avatarUrl?: string; // Optional field
  createdAt?: Date; // Auto-generated, usually not needed during creation
  updatedAt?: Date; // Auto-updated, usually not needed during creation
  posts?: any[]; // Assuming Post is another entity you will reference
  comments?: any[]; // Same for Comment
  likes?: any[]; // Same for Like
  favorites?: any[]; // Same for Favorite
  histories?: any[]; // Same for History
}
