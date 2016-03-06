class ChangeInstancesToTasks < ActiveRecord::Migration
  def change
		rename_table :instances, :tasks 
  end
end
