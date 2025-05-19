terraform {
  required_providers {
    vagrant = {
      source = "bmatcuk/vagrant"
      version = "~> 4.0.0"
    }
  }
}

resource "vagrant_vm" "api_server" {
  vagrantfile_dir = "${path.module}"
  env = {
    VAGRANT_EXPERIMENTAL = "disks"
  }
}

output "vm_ssh_config" {
  value = vagrant_vm.api_server.ssh_config
  sensitive = true
}

output "vm_status" {
  value = vagrant_vm.api_server.status
}
