module ApplicationHelper
  def japanese_day(date)
    days_of_week = ['日', '月', '火', '水', '木', '金', '土']
    days_of_week[date.wday]
  end
end
