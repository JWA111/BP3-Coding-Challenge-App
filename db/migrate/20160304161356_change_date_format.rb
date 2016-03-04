class ChangeDateFormat < ActiveRecord::Migration
  def up
	change_column :instances, :dueDate, :string
	change_column :instances, :closeDate, :string
	change_column :instances, :createDate, :string
  end
  def down
	change_column :instances, :dueDate, :time
        change_column :instances, :closeDate, :time
        change_column :instances, :createDate, :time
  end
end
