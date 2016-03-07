class ConvertToTime < ActiveRecord::Migration
	def change
		execute "ALTER TABLE tasks
 				ALTER \"dueDate\" type timestamp USING \"dueDate\"::timestamp without time zone"
		execute "ALTER TABLE tasks
                                ALTER \"closeDate\" type timestamp USING \"dueDate\"::timestamp without time zone"
		execute "ALTER TABLE tasks
                                ALTER \"createDate\" type timestamp USING \"dueDate\"::timestamp without time zone"
  	end
end
