variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "db_username" {
  type    = string
  default = "taskflow_user"
}

variable "db_password" {
  type      = string
  sensitive = true
  default   = "taskflow_password_secret"
}
