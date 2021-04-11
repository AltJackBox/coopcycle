package fr.polytech.info4.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Cooperative.
 */
@Entity
@Table(name = "cooperative")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Cooperative implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(min = 3)
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "geographical_area")
    private String geographicalArea;

    @OneToMany(mappedBy = "cooperative")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "produits", "paniers", "cooperative" }, allowSetters = true)
    private Set<Restaurant> restaurants = new HashSet<>();

    @JsonIgnoreProperties(value = { "cooperative", "paniers" }, allowSetters = true)
    @OneToOne(mappedBy = "cooperative")
    private Compte compte;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cooperative id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Cooperative name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGeographicalArea() {
        return this.geographicalArea;
    }

    public Cooperative geographicalArea(String geographicalArea) {
        this.geographicalArea = geographicalArea;
        return this;
    }

    public void setGeographicalArea(String geographicalArea) {
        this.geographicalArea = geographicalArea;
    }

    public Set<Restaurant> getRestaurants() {
        return this.restaurants;
    }

    public Cooperative restaurants(Set<Restaurant> restaurants) {
        this.setRestaurants(restaurants);
        return this;
    }

    public Cooperative addRestaurant(Restaurant restaurant) {
        this.restaurants.add(restaurant);
        restaurant.setCooperative(this);
        return this;
    }

    public Cooperative removeRestaurant(Restaurant restaurant) {
        this.restaurants.remove(restaurant);
        restaurant.setCooperative(null);
        return this;
    }

    public void setRestaurants(Set<Restaurant> restaurants) {
        if (this.restaurants != null) {
            this.restaurants.forEach(i -> i.setCooperative(null));
        }
        if (restaurants != null) {
            restaurants.forEach(i -> i.setCooperative(this));
        }
        this.restaurants = restaurants;
    }

    public Compte getCompte() {
        return this.compte;
    }

    public Cooperative compte(Compte compte) {
        this.setCompte(compte);
        return this;
    }

    public void setCompte(Compte compte) {
        if (this.compte != null) {
            this.compte.setCooperative(null);
        }
        if (compte != null) {
            compte.setCooperative(this);
        }
        this.compte = compte;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cooperative)) {
            return false;
        }
        return id != null && id.equals(((Cooperative) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cooperative{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", geographicalArea='" + getGeographicalArea() + "'" +
            "}";
    }
}
