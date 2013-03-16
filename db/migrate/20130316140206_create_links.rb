class CreateLinks < ActiveRecord::Migration
  def change
    create_table :links do |t|
      t.string :title
      t.string :uri
      t.text :description
      t.boolean :private

      t.timestamps
    end
  end
end
