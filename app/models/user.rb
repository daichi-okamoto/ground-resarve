class User < ApplicationRecord
  authenticates_with_sorcery!

  validates :name, presence: true
  validates :postal_code, presence: true
  validates :prefecture, presence: true
  validates :address, presence: true
  validates :email, presence: true, uniqueness: true
  validates :credit_card, presence: true
  validates :user_type, presence: true, inclusion: { in: %w[individual organization association] }
  validates :team_name, presence: true, if: -> { %w[organization association].include?(user_type) }
  validates :password, presence: true, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }
end