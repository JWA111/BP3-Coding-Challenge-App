class AllowNullCloseDate < ActiveRecord::Migration
  def change
	change_column_null(:tasks, :closeDate, true )
	change_column_null(:tasks, :assignee, true )
	change_column_null(:tasks, :assigneeType, true )
	change_column_null(:tasks, :url, true )
	change_column_null(:tasks, :variables, true )
  end
end
