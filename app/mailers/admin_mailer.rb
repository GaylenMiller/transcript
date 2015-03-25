class AdminMailer < ActionMailer::Base
  default from: "gaylen@millersrock.com"


  def course_updated_email course
    @course = course
    mail(to: 'gaylen@gotdelight.com', subject: "Course updated - #{course.course_name}")
  end

  def course_added_email course
    @course = course
    mail(to: 'gaylen@gotdelight.com', subject: "New Course Added - #{course.course_name}")
  end
end
