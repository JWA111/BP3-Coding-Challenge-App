class CreateInstances < ActiveRecord::Migration
  def change
    create_table :instances do |t|
      t.string :instanceName, null: false
      t.time :dueDate, null: false
      t.string :priority, null: false
      t.time :closeDate, null: false
      t.string :instanceStatus, null: false
      t.string :assigneeType, null: false
      t.time :createDate, null: false
      t.string :name, null: false
      t.string :url, null: false
      t.string :assignee, null: false
      t.integer :instanceId, null: false
      t.string :status, null: false
      t.string :variables, null: false
      t.string :processName, null: false
      t.integer :taskId, null: false

      t.timestamps null: false
    end

	add_index :instances, :taskId, unique: true
  end
end
