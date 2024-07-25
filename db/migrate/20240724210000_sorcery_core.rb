class SorceryCore < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name,             null: false
      t.string :postal_code,      null: false  # 郵便番号
      t.string :prefecture,       null: false  # 都道府県
      t.string :address,          null: false
      t.string :email,            null: false, index: { unique: true }
      t.string :credit_card,      null: false
      t.string :crypted_password
      t.string :salt
      t.string :user_type,        null: false  # ユーザータイプ（個人 or 団体）
      t.string :team_name                      # 団体の場合のチーム名

      t.timestamps                null: false
    end
  end
end
