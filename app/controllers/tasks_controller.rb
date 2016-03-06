class TasksController < ApplicationController

	def create
		respond_with Tasks.create(assignee: params[:assignee], assigneeType: params[:assigneeType], closeDate: params[:closeDate], createDate: params[:createDate], dueDate: params[:dueDate], instanceId: params[:instanceId], instanceName: params[:instanceName], instanceStatus: params[:instanceStatus], name: params[:name], priority: params[:priority], processName: params[:processName], status: params[:status], taskId: params[:taskId], url: params[:url], variables: params[:variables])
	end
end
