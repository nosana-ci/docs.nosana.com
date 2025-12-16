<template>
  <div style="z-index: 100; position: relative">
    <nav
      class="navbar py-1 is-fixed-top"
      role="navigation"
      aria-label="main navigation"
      :class="{ 'menu-expanded': mobileMenu }"
    >
      <div class="container">
        <div class="toggle-sidebar">
          <label for="check">
            <input type="checkbox" id="check" @change="mobileSidebar = !mobileSidebar" />
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>
        <div class="navbar-brand">
          <a class="navbar-item p-0 logo-top" href="https://nosana.com/">
            <img class="logo" src="/assets/logo_new.svg" />
          </a>

          <a
            role="button"
            class="navbar-burger"
            aria-label="menu"
            :class="{ 'is-active': mobileMenu }"
            aria-expanded="false"
            data-target="navbar"
            @click="mobileMenu = !mobileMenu"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>

        <div id="navbar" class="navbar-menu" :class="{ 'is-active': mobileMenu }">
          <div class="navbar-start" />
          <div class="navbar-end is-align-items-center">
            <div class="navbar-item is-hoverable" @click="mobileMenu = false">
              <a
                class="navbar-link is-arrowless"
                href="https://nosana.com/hosts"
                exact-active-class="is-active"
              >
                <div>Hosting</div>
            </a>
            </div>
            <div class="navbar-item" @click="mobileMenu = false">
              <a
                class="navbar-link is-arrowless"
                href="https://nosana.com/clients"
                exact-active-class="is-active"
              >
                <div>Deploy AI Workloads</div>
            </a>
            </div>
            <div class="navbar-item has-dropdown is-hoverable" @click="mobileMenu = false">
              <a class="navbar-link is-arrowless">
                <div>Network</div>
              </a>
              <div class="navbar-dropdown is-boxed">
                <a class="navbar-item" to="/team"> About Nosana </a>
                <a class="navbar-item" href="https://nosana.com/token"> $NOS Token </a>
                <a href="https://dashboard.nosana.com/stake/" target="_blank" class="navbar-item">
                  <span>Staking</span>
                </a>
              </div>
            </div>
            <div class="navbar-item" @click="mobileMenu = false">
              <a
                class="navbar-link is-arrowless"
                href="https://grants.nosana.com/"
                exact-active-class="is-active"
                target="_blank"
              >
                <div>Grants Program</div>
              </a>
            </div>
            <div class="navbar-item has-dropdown is-hoverable" @click="mobileMenu = false">
              <a class="navbar-link is-arrowless">
                <div>Resources</div>
              </a>
              <div class="navbar-dropdown is-boxed">
                <a href="https://docs.nosana.com" target="_blank" class="navbar-item is-active">
                  <span>Docs</span>
                </a>
                <a class="navbar-item" href="https://nosana.com/blog">
                  <span>Blog</span>
                </a>
                <a class="navbar-item" href="https://nosana.com/blog?tag=events">
                  <span>Events</span>
                </a>
                <a class="navbar-item" href="https://nosana.com/support">
                  <span>Support</span>
                </a>
                <a class="navbar-item" href="https://nosana.com/brand">
                  <span>Brand Assets</span>
                </a>
              </div>
            </div>
            <div class="navbar-item" @click="mobileMenu = false">
              <a target="_blank" href="https://dashboard.nosana.com/" class="button is-secondary is-size-6"
                >Deploy Now</a
              >
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      mobileMenu: false,
      mobileSidebar: false,
    };
  },
  watch: {
    mobileSidebar: function (newValue) {
      const themeContainer = document.getElementsByClassName('theme-container')[0];
      if (themeContainer.classList.contains('sidebar-open')) {
        themeContainer.classList.remove('sidebar-open');
        document.getElementById('check').checked = false;
      } else {
        themeContainer.classList.add('sidebar-open');
        document.getElementById('check').checked = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.toggle-sidebar {
  align-items: center;
  z-index: 99;
  display: none;
  height: 49px;
  padding: 0 20px;
  position: absolute !important;
  @media screen and (max-width: 720px) {
    display: flex;
  }

  label {
    display: flex;
    flex-direction: column;
    width: 20px;
    cursor: pointer;
  }

  label span {
    background: #fff;
    border-radius: 10px;
    height: 1px;
    margin: 2px 0;
    transition: 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  }

  span:nth-of-type(1) {
    width: 50%;
  }

  span:nth-of-type(2) {
    width: 100%;
  }

  span:nth-of-type(3) {
    width: 75%;
  }

  input[type='checkbox'] {
    display: none;
  }
}
.sidebar-open {
  .toggle-sidebar {
    input[type='checkbox']:checked ~ span:nth-of-type(1) {
      transform-origin: bottom;
      transform: rotatez(45deg) translate(2px, 0px);
    }

    input[type='checkbox']:checked ~ span:nth-of-type(2) {
      transform-origin: top;
      transform: rotatez(-45deg);
    }

    input[type='checkbox']:checked ~ span:nth-of-type(3) {
      transform-origin: bottom;
      width: 50%;
      transform: translate(9px, -1px) rotatez(45deg);
    }
  }
}
.button.is-secondary {
  background-color: #10e80c;
  border-color: transparent;
  color: rgba(0, 0, 0, 0.7);
}
.button {
  height: 2.6em;
}
.is-size-6 {
  font-size: 1rem !important;
}

.button {
  cursor: pointer;
  justify-content: center;
  padding: calc(0.5em - 2px) 1.7em;
  text-align: center;
  white-space: nowrap;
}
.navbar {
  z-index: 100;
  &.is-transparent {
    background: transparent;
  }

  @media screen and (max-width: 1023px) {
    &.menu-expanded {
      background-color: black !important;
    }
    > .container {
      margin-top: 14px;
    }
  }

  .logo {
    height: 38px;
    max-width: none;
    max-height: none;
    margin-top: 0px;
    margin-right: 8px;
  }

  .navbar-brand {
    .navbar-item {
      &.is-active,
      &:hover {
        color: #1c282a;
      }
    }
    @media screen and (max-width: 1023px) {
      padding: 0 10px !important;
      .logo-top {
        width: 100%;
        justify-content: center;
      }
      .navbar-burger {
        margin-left: -40px;
      }
    }
  }

  .navbar-menu {
    margin-top: 8px;
    justify-content: center;

    .navbar-item {
      font-weight: 500;
      padding: 10px 20px;
      text-align: center;
      font-size: 0.9rem;

      @media screen and (max-width: 1023px) {
        &.has-dropdown > a {
          background: #1c282a;
        }
      }

      &.is-active {
        color: #1c282a;
        font-weight: 700;
        background-color: hsl(221, 14%, calc(100% + 0%)) !important;

        &:after {
          width: calc(100% - 1.5rem - 15px);
        }
      }
    }
  }
}

.navbar {
  background: rgba(0, 0, 0, 0.7);
  @media screen and (max-width: 1023px) {
    .navbar-burger {
      color: #fff;
    }
  }
}

.navbar {
  .navbar-menu {
    .navbar-item .navbar-link {
      color: #fff;
      &:focus, &:hover {
        background: transparent;
      }
      &.is-active {
        background: transparent;
        text-decoration: underline;
      }
    }
  }
}

@media screen and (max-width: 1023px) {
  .navbar {
    .navbar-menu {
      background-color: black;
      .navbar-item {
        color: #fff;
        &.is-active,
        &:hover {
          color: black;
        }
        .navbar-dropdown {
          .navbar-item {
            &:hover {
              background-color: #666;
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1024px) {
  .navbar > .container .navbar-brand,
  .container > .navbar .navbar-brand {
    margin-left: 0;
  }
  .navbar > .container .navbar-menu,
  .container > .navbar .navbar-menu {
    margin-right: 0;
  }
  .navbar .navbar-menu .navbar-item {
    &:hover a.navbar-link {
      background-color: transparent !important;
    }
  }
}
</style>
