class TasksController < ApplicationController

	def create
		params[:dueDate] = DateTime.parse(params[:dueDate])
		if params[:closeDate].present?
			params[:closeDate] = DateTime.parse(params[:closeDate])
		end
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



		elsif params[:type].present? and params[:type] == "search"
		  if params[:search].present?

			#build the params
			sql_params = ''
		  	if params[:date1].present? and params[:hour1].present? and params[:min1].present? and params[:sec1].present? and params[:time1].present?
			  params[:date1] = params[:date1].gsub("/", "-")
			  if params[:time1] == "PM"
				params[:hour1] = (params[:hour1].to_i + 12).to_s
			  end
			  search_date1 = params[:date1] << " " << '%02d' % params[:hour1] << ":" << '%02d' % params[:min1] << ":" << '%02d' % params[:sec1]
			end


			if params[:date2].present? and params[:hour2].present? and params[:min2].present? and params[:sec2].present? and params[:time2].present?
			  params[:date2] = params[:date2].gsub("/", "-")
			  if params[:time2] == "PM"
				params[:hour2] = (params[:hour2].to_i + 12).to_s
			  end
			  search_date2 = params[:date2] << " " << '%02d' % params[:hour2] << ":" << '%02d' % params[:min2] << ":" << '%02d' % params[:sec2]
			end


			if search_date1.present? and search_date2.present?
			  if params[:status].present? and params[:status] == 'open'
				sql_params =  " AND \"createDate\" >= '" << search_date1 << "' AND \"createDate\" <= '" << search_date2 << "'"
			  elsif params[:status].present? and params[:status] == 'closed'
				sql_params =  " AND \"closeDate\" >= '" << search_date1 << "' AND \"closeDate\" <= '" << search_date2 << "'"
			  else
				sql_params =  " AND \"createDate\" >= '" << search_date1 << "' AND \"createDate\" <= '" << search_date2 <<
								"' AND \"closeDate\" >= '" << search_date1 << "' AND \"closeDate\" <= '" << search_date2 << "'"
			  end


			elsif search_date1.present?
			  if params[:status].present? and params[:status] == 'open'
				sql = "SELECT COUNT(*) FROM tasks WHERE \"createDate\" <= '" << search_date1 << "' AND \"closeDate\" > '" << search_date1 << "';"
			  elsif params[:status].present? and params[:status] == 'closed'
				sql_params =  " AND \"closeDate\" <= '" << search_date1 << "'"
			  else
				sql_params =  " AND \"createDate\" <= '" << search_date1 << "'"
			  end
			end


		  	if params[:instanceName].present?
			  sql_params << " AND UPPER(\"instanceName\") = UPPER('" << params[:instanceName] << "')"
			end
			if params[:instanceId].present?
			  sql_params << " AND \"instanceId\" = '" << params[:instanceId] << "'"
			end
			if params[:status].present? and !search_date1.present?
			  sql_params << " AND UPPER(\"status\") = UPPER('" << params[:status] << "')"
			end
			if params[:assignee].present?
			  sql_params << " AND UPPER(\"assignee\") = UPPER('" << params[:assignee] << "')"
			end
			if params[:processName].present?
			  sql_params << " AND UPPER(\"processName\") = UPPER('" << params[:processName] << "')"
			end

			#include any sql limits
			sql_order = ''
			if search_date1.present?
			  sql_order << " ORDER BY \"createDate\", \"closeDate\" DESC"
			end
			sql_limits = " LIMIT 8 OFFSET " << params[:offset] << ";"
				#build the query from the search string and params
			if /^[1-9]([0-9]*)?$/.match(params[:search])
			  sql = "(SELECT * FROM tasks WHERE CAST (\"taskId\" AS text) LIKE '%"<<params[:search]<<"%'" << sql_params << sql_order << ") UNION" <<
			 		" (SELECT * FROM tasks WHERE CAST (\"instanceId\" AS text) LIKE '%"<<params[:search]<<"%'" << sql_params << sql_order << ")" << sql_limits
			else
			  sql = "(SELECT * FROM tasks WHERE UPPER(name) LIKE UPPER('%"<<params[:search]<<"%')" << sql_params << sql_order << ") UNION" <<
				  	" (SELECT * FROM tasks WHERE UPPER(\"instanceName\") LIKE UPPER('%"<<params[:search]<<"%')" << sql_params << sql_order << ") UNION" <<
				  	" (SELECT * FROM tasks WHERE UPPER(\"processName\") LIKE UPPER('%"<<params[:search]<<"%')" << sql_params << sql_order << ") UNION" <<
				  	" (SELECT * FROM tasks WHERE UPPER(assignee) LIKE UPPER('%"<<params[:search]<<"%')" << sql_params << sql_order << ") UNION" <<
				  	" (SELECT * FROM tasks WHERE UPPER(status) LIKE UPPER('%"<<params[:search]<<"%')" << sql_params << sql_order << ") UNION" <<
				  	" (SELECT * FROM tasks WHERE UPPER(url) LIKE UPPER('%"<<params[:search]<<"%')" << sql_params << sql_order << ")" << sql_limits
			end

			results = ActiveRecord::Base.connection.execute(sql)
		  end
		else
		  results = "Command not recognized!"
		end

		respond_to do |format|
			format.html {}
			format.json {render json: results}
		end
	end

end
