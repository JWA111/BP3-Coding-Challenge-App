class TasksController < ApplicationController

	def create 
		tasks_params[:dueDate] = DateTime.parse(tasks_params[:dueDate]).to_i
		tasks_params[:closeDate] = DateTime.parse(tasks_params[:closeDate]).to_i
		tasks_params[:createDate] = DateTime.parse(tasks_params[:createDate]).to_i
		respond_with Tasks.create(tasks_params)
	end

	def index
		if params[:type].present? and params[:type] == "state"
			
		end
	end
	
end
