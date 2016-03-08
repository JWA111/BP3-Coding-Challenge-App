class TasksController < ApplicationController

	def create
		params[:dueDate] = DateTime.parse(params[:dueDate])
		params[:closeDate] = DateTime.parse(params[:closeDate])
		params[:createDate] = DateTime.parse(params[:createDate])
		respond_with Tasks.create(instanceName: params[:instanceName],dueDate: params[:dueDate],
															priority: params[:priority],closeDate: params[:closeDate],
															instanceStatus: params[:instanceStatus],assigneeType: params[:assigneeType],
															createDate: params[:createDate],name: params[:name],url: params[:url],
															assignee: params[:assignee],instanceId: params[:instanceId],status: params[:status],
															variables: params[:variables],processName: params[:processName],taskId: params[:taskId] )
	end

	def index

		results = {}

		if params[:type].present? and params[:type] == "state"
			params[:date] = params[:date].gsub("/", "-")
			if params[:time] == "PM"
				params[:hour] = (params[:hour].to_i + 12).to_s
			end
			search_date = params[:date] << " " << '%02d' % params[:hour] << ":" << '%02d' % params[:min] << ":" << '%02d' % params[:sec]
			sql = "SELECT COUNT(*) FROM tasks WHERE \"closeDate\" <= '" << search_date << "';"
			closed = ActiveRecord::Base.connection.execute(sql)
			sql = "SELECT COUNT(*) FROM tasks WHERE \"createDate\" <= '" << search_date <<
						"' AND \"closeDate\" > '" << search_date << "';"
			open = ActiveRecord::Base.connection.execute(sql)
			results = {'closed' => closed[0]['count'], 'open' => open[0]['count']}.to_json

		elsif params[:type].present? and params[:type] == "time"
			params[:date] = params[:date].gsub("/", "-")
			params[:date2] = params[:date2].gsub("/", "-")
			if params[:time] == "PM"
				params[:hour] = (params[:hour].to_i + 12).to_s
			end
			if params[:time2] == "PM"
				params[:hour2] = (params[:hour2].to_i + 12).to_s
			end
			search_date = params[:date] << " " << '%02d' % params[:hour] << ":" << '%02d' % params[:min] << ":" << '%02d' % params[:sec]
			search_date2 = params[:date2] << " " << '%02d' % params[:hour2] << ":" << '%02d' % params[:min2] << ":" << '%02d' % params[:sec2]
			sql = "SELECT COUNT(*) FROM tasks WHERE \"closeDate\" < '" << search_date2 <<
						"' AND \"closeDate\" >= '" << search_date << "';"
			closed = ActiveRecord::Base.connection.execute(sql)
			sql = "SELECT COUNT(*) FROM tasks WHERE \"createDate\" >= '" << search_date <<
						"' AND \"createDate\" < '" << search_date2 << "';"
			open = ActiveRecord::Base.connection.execute(sql)
			results = {'closed' => closed[0]['count'], 'open' => open[0]['count']}.to_json

		elsif params[:type].present? and params[:type] == "instance"
			sql = "SELECT COUNT(*) FROM tasks WHERE \"instanceId\"='" << params[:id] <<
						"' AND\"closeDate\" IS NOT NULL;"
			closed = ActiveRecord::Base.connection.execute(sql)
			sql = "SELECT COUNT(*) FROM tasks WHERE \"instanceId\"='" << params[:id] <<
						"' AND\"closeDate\" IS NULL;"
			open = ActiveRecord::Base.connection.execute(sql)
			results = {'closed' => closed[0]['count'], 'open' => open[0]['count']}.to_json

		elsif params[:type].present? and params[:type] == "assignee"
			sql = "SELECT COUNT(*) FROM tasks WHERE \"assignee\"='" << params[:name] <<
					"' AND\"closeDate\" IS NOT NULL;"
			closed = ActiveRecord::Base.connection.execute(sql)
			sql = "SELECT COUNT(*) FROM tasks WHERE \"assignee\"='" << params[:name] <<
					"' AND\"closeDate\" IS NULL;"
			open = ActiveRecord::Base.connection.execute(sql)
			results = {'closed' => closed[0]['count'], 'open' => open[0]['count']}.to_json
		end

		respond_to do |format|
			format.html {}
			format.json {render json: results}
		end
	end

end
